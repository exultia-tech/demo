import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { execSync } from 'child_process';
import path from 'path';
import fs from 'fs';
import { GET as getArgentFeed } from '@/app/api/argent/feed/route';

describe('Exultia Kinetic & Argent General Patch Management Deployment Suite', () => {
  const projectRoot = process.cwd();
  const testStateDir = path.join(projectRoot, '.temp_kinetic_argent_test_state');

  beforeAll(() => {
    fs.mkdirSync(testStateDir, { recursive: true });
  });

  afterAll(() => {
    try {
      fs.rmSync(testStateDir, { recursive: true, force: true });
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
});
