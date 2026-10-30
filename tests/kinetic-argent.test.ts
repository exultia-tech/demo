import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { execSync } from 'child_process';
import path from 'path';
import fs from 'fs';
import { GET as getArgentFeed } from '@/app/api/argent/feed/route';
import { getArgentBundles } from '@/lib/argent-feed';

describe('Exultia Kinetic & Argent General Patch Management Deployment Suite', () => {
  const projectRoot = process.cwd();
  const testStateDir = path.join(projectRoot, '.temp_kinetic_argent_test_state');
  const testStagingDir = path.join(projectRoot, '.temp_kinetic_argent_test_staging');

  beforeAll(() => {
    fs.mkdirSync(testStateDir, { recursive: true });
    fs.mkdirSync(testStagingDir, { recursive: true });
  });

  afterAll(() => {
    try {
      fs.rmSync(testStateDir, { recursive: true, force: true });
      fs.rmSync(testStagingDir, { recursive: true, force: true });
    } catch {
      // ignore on windows file lock
    }
  });

  describe('1. Argent Feed Kinetic Format Integrity & Spec Compliance', () => {
    it('should format Argent vendor patch feed in Kinetic-native schema', async () => {
      const req = new Request('http://localhost:3000/api/argent/feed?format=kinetic');
      const res = await getArgentFeed(req);
      expect(res.status).toBe(200);

      const json = await res.json();
      expect(json.feedVersion).toBe('2.0.0-argent');
      expect(json.source).toBe('Exultia Argent Vendor Patch Aggregator');
      expect(Array.isArray(json.patches)).toBe(true);
      expect(json.patches.length).toBeGreaterThanOrEqual(30);

      // Verify every patch has required package upgrade and rollback properties
      for (const p of json.patches) {
        expect(p.id).toBeDefined();
        expect(p.title).toBeDefined();
        expect(p.remediationTier.tier2_packageUpgrade).toBeDefined();
        expect(p.remediationTier.tier2_packageUpgrade.packageName).toBeDefined();
        expect(p.remediationTier.tier2_packageUpgrade.upgradeCommand).toBeDefined();
        expect(p.remediationTier.tier1_hotMitigation.rollbackCommand).toBeDefined();
        expect(p.provenance.slsaLevel).toBe(3);
      }
    });

    it('should support OS distribution filtering on the Argent kinetic feed', async () => {
      const reqUbuntu = new Request('http://localhost:3000/api/argent/feed?format=kinetic&os=ubuntu');
      const resUbuntu = await getArgentFeed(reqUbuntu);
      const dataUbuntu = await resUbuntu.json();

      expect(dataUbuntu.patches.length).toBeGreaterThan(0);
      for (const p of dataUbuntu.patches) {
        expect(p.affectedDistros).toContain('ubuntu');
      }

      const reqRocky = new Request('http://localhost:3000/api/argent/feed?format=kinetic&os=rocky');
      const resRocky = await getArgentFeed(reqRocky);
      const dataRocky = await resRocky.json();

      expect(dataRocky.patches.length).toBeGreaterThan(0);
      for (const p of dataRocky.patches) {
        expect(p.affectedDistros).toContain('rocky');
      }
    });
  });

  describe('2. Kinetic CLI Deployment of Argent Patch Bundles', () => {
    it('should deploy all eligible OS package updates via kinetic upgrade --dry-run', () => {
      const cmd = `python kinetic-cli/run.py upgrade --dry-run --state-dir "${testStateDir}"`;
      const out = execSync(cmd, { encoding: 'utf-8' });

      expect(out).toContain('Ingesting OS Distribution Patch Feeds');
      expect(out).toContain('[Kinetic Upgrade] Feed Source:');
      expect(out).toContain('[PASS] Successfully applied package upgrade');
      expect(out).toContain('Applied');
    }, 15000);

    it('should deploy specific OS package updates via kinetic upgrade --os ubuntu', () => {
      const cmd = `python kinetic-cli/run.py upgrade --os ubuntu --dry-run --state-dir "${testStateDir}"`;
      const out = execSync(cmd, { encoding: 'utf-8' });

      expect(out).toContain('Ingesting OS Distribution Patch Feeds');
      expect(out).toContain('[PASS] Successfully applied package upgrade');
      expect(out).toContain('[Ubuntu Linux]');
      expect(out).not.toContain('[Red Hat Enterprise Linux]');
      expect(out).not.toContain('[Alpine Linux]');
    }, 15000);

    it('should deploy a targeted vendor advisory bundle via kinetic upgrade --bundle', () => {
      const cmd = `python kinetic-cli/run.py upgrade --bundle RLBA-2024:3910 --dry-run --state-dir "${testStateDir}"`;
      const out = execSync(cmd, { encoding: 'utf-8' });

      expect(out).toContain('Found 1 eligible OS package bundle(s) to apply.');
      expect(out).toContain('RLBA-2024:3910');
      expect(out).toContain('[PASS] Successfully applied package upgrade for kernel');
      expect(out).toContain('Applied 1/1 bundle(s)');
    }, 15000);
  });

  describe('3. Deterministic Rollback of Deployed Argent Packages', () => {
    it('should record snapshot and execute sub-second deterministic rollback for Argent patch', () => {
      // 1. Deploy single patch to generate snapshot record
      const deployCmd = `python kinetic-cli/run.py upgrade --bundle RLBA-2024:3910 --dry-run --state-dir "${testStateDir}"`;
      execSync(deployCmd, { encoding: 'utf-8' });

      // 2. Verify snapshot record was written to state directory
      const statePath = path.join(testStateDir, 'state.json');
      expect(fs.existsSync(statePath)).toBe(true);
      const state = JSON.parse(fs.readFileSync(statePath, 'utf-8'));
      expect(Array.isArray(state.snapshots)).toBe(true);
      expect(state.snapshots.length).toBeGreaterThan(0);

      const lastSnap = state.snapshots[state.snapshots.length - 1];
      expect(lastSnap.target_path).toContain('pkg:');
      expect(lastSnap.status).toBe('active');

      // 3. Rollback the deployed patch using sub-second deterministic rollback
      const rbCmd = `python kinetic-cli/run.py rollback --latest --state-dir "${testStateDir}"`;
      const rbOut = execSync(rbCmd, { encoding: 'utf-8' });

      expect(rbOut).toContain('[Kinetic] --- Sub-Second Deterministic Rollback:');
      expect(rbOut).toContain('[PASS] Deterministic rollback completed in');
      expect(rbOut).toContain('Host returned to verified baseline.');

      // 4. Verify snapshot state updated to rolled_back
      const stateUpdated = JSON.parse(fs.readFileSync(statePath, 'utf-8'));
      const rolledBackSnap = stateUpdated.snapshots.find((s: any) => s.snapshot_id === lastSnap.snapshot_id);
      expect(rolledBackSnap.status).toBe('rolled_back');
    });

    it('should log OS_UPGRADE deployment events in the audit log', () => {
      const auditPath = path.join(testStateDir, 'audit.jsonl');
      expect(fs.existsSync(auditPath)).toBe(true);

      const content = fs.readFileSync(auditPath, 'utf-8');
      expect(content).toContain('OS_UPGRADE');
    });
  });

  describe('4. Local OS Patch Staging, Non-Reboot Auto-Patching & Off-Peak Disruptive Reboot Policy', () => {
    it('should stage relevant OS patches into the local staging directory and apply non-reboot items', () => {
      const cmd = `python kinetic-cli/run.py upgrade --os ubuntu --staging-dir "${testStagingDir}" --auto-patch-non-reboot --disruptive-auto-reboot --off-peak-window "00:00-23:59" --dry-run --json --state-dir "${testStateDir}"`;
      const out = execSync(cmd, { encoding: 'utf-8' });
      const jsonStart = out.indexOf('{');
      expect(jsonStart).toBeGreaterThanOrEqual(0);
      const summary = JSON.parse(out.slice(jsonStart));

      expect(summary.target_os).toBe('ubuntu');
      expect(summary.staged_count).toBeGreaterThanOrEqual(2);
      expect(summary.applied_non_reboot_count).toBeGreaterThanOrEqual(1);
      expect(summary.applied_disruptive_count).toBeGreaterThanOrEqual(1);
      expect(summary.reboot_scheduled).toBe(true);

      const ubuntuStagingPath = path.join(testStagingDir, 'ubuntu');
      expect(fs.existsSync(ubuntuStagingPath)).toBe(true);
    }, 15000);

    it('should provide both non-disruptive and disruptive patch bundles for all 34 supported OSes with strict OS isolation', () => {
      const expectedOses = [
        'almalinux', 'alpine', 'amazon-linux', 'arch', 'azure-linux',
        'centos-stream', 'cloudlinux', 'debian', 'fedora', 'fedora-coreos',
        'flatcar', 'freebsd', 'gentoo', 'kali', 'kernel', 'linux-mint',
        'macos', 'netbsd', 'nixos', 'openbsd', 'openeuler', 'opensuse-leap',
        'openwrt', 'oracle-linux', 'photon', 'proxmox', 'rhel', 'rocky',
        'suse', 'talos', 'truenas-scale', 'ubuntu', 'void', 'wolfi'
      ];
      expect(expectedOses.length).toBe(34);

      for (const osName of expectedOses) {
        const res = getArgentBundles({ os: osName, limit: 100 });
        expect(res.bundles.length).toBeGreaterThanOrEqual(2);
        for (const b of res.bundles) {
          expect(b.os).toBe(osName);
        }
        const nonDisruptive = res.bundles.filter(b => !b.impact.rebootRequired);
        const disruptive = res.bundles.filter(b => b.impact.rebootRequired);
        expect(nonDisruptive.length).toBeGreaterThanOrEqual(1);
        expect(disruptive.length).toBeGreaterThanOrEqual(1);
      }
    });

    it('should execute vendor-native builtin updates, configure systemd/cron schedulers, and enforce --fullauto --confirm', () => {
      // 1. Vendor-native + deferred windows
      const vnCmd = `python kinetic-cli/run.py upgrade --os rocky --staging-dir "${testStagingDir}" --vendor-native --auto-patch-non-reboot --disruptive-auto-reboot --deferred-windows "Sat 01:00-05:00, Sun 01:00-05:00" --dry-run --json --state-dir "${testStateDir}"`;
      const vnOut = execSync(vnCmd, { encoding: 'utf-8' });
      const vnSummary = JSON.parse(vnOut.slice(vnOut.indexOf('{')));
      expect(vnSummary.vendor_native_updates).toBe(true);
      expect(vnSummary.vendor_native_result.status).toBe('success');
      expect(vnSummary.vendor_native_result.command).toContain('dnf upgrade-minimal');

      // 2. Systemd & Crontab scheduler
      const schedCmd = `python kinetic-cli/run.py schedule --mode both --os ubuntu --cron "0 * * * *" --deferred-window "02:00-05:00" --dry-run --json --state-dir "${testStateDir}"`;
      const schedOut = execSync(schedCmd, { encoding: 'utf-8' });
      const schedSummary = JSON.parse(schedOut.slice(schedOut.indexOf('{')));
      expect(schedSummary.mode).toBe('both');
      expect(schedSummary.installed_files.length).toBe(3);

      // 3. --fullauto without --confirm must fail
      let rejected = false;
      try {
        execSync(`python kinetic-cli/run.py daemon --fullauto --once --dry-run --state-dir "${testStateDir}"`, { stdio: 'pipe' });
      } catch (err: any) {
        rejected = err.status === 2;
      }
      expect(rejected).toBe(true);

      // 4. --fullauto --confirm must succeed
      const faCmd = `python kinetic-cli/run.py upgrade --os ubuntu --staging-dir "${testStagingDir}" --fullauto --confirm --dry-run --json --state-dir "${testStateDir}"`;
      const faOut = execSync(faCmd, { encoding: 'utf-8' });
      const faSummary = JSON.parse(faOut.slice(faOut.indexOf('{')));
      expect(faSummary.fullauto).toBe(true);
      expect(faSummary.confirmed).toBe(true);
      expect(faSummary.status).toBe('completed');

      // 5. Open-source kernel livepatching (CONFIG_LIVEPATCH / kpatch + eBPF CO-RE)
      const lpCmd = `python kinetic-cli/exultia.py livepatch apply --cve CVE-2024-1086 --mode both --staging-dir "${testStagingDir}" --dry-run --json --state-dir "${testStateDir}"`;
      const lpOut = execSync(lpCmd, { encoding: 'utf-8' });
      const lpSummary = JSON.parse(lpOut.slice(lpOut.indexOf('{')));
      expect(lpSummary.non_commercial_open_source).toBe(true);
      expect(lpSummary.requires_reboot).toBe(false);
      expect(lpSummary.applied_count).toBe(1);

      // 6. Unified `xul` shorthand CLI (--patch, --compile, --search)
      const xulPatchCmd = `python kinetic-cli/xul.py --patch --os ubuntu --staging-dir "${testStagingDir}" --non-reboot --vendor --livepatch --dry-run --json --state-dir "${testStateDir}"`;
      const xulPatchOut = execSync(xulPatchCmd, { encoding: 'utf-8' });
      const xulPatchSummary = JSON.parse(xulPatchOut.slice(xulPatchOut.indexOf('{')));
      expect(xulPatchSummary.vendor_native_updates).toBe(true);
      expect(xulPatchSummary.kernel_livepatch).toBe(true);

      const xulCompileCmd = `python kinetic-cli/xul.py --compile CVE-2024-6387 --json --state-dir "${testStateDir}"`;
      const xulCompileOut = execSync(xulCompileCmd, { encoding: 'utf-8' });
      const xulCompileSummary = JSON.parse(xulCompileOut.slice(xulCompileOut.indexOf('{')));
      expect(xulCompileSummary.cve_id).toBe('CVE-2024-6387');
      expect(xulCompileSummary.posix_script).toContain('#!/bin/sh');
    }, 25000);
  });
});
