import { describe, it, expect } from 'vitest';
import { SAMPLE_PATCH_FEED, GET } from '@/app/api/patches/feed/route';
import { NextRequest } from 'next/server';

describe('Exultia Kinetic Rapid Patch Management Feed Tests', () => {

  describe('Feed Data Schema & Integrity', () => {
    it('should contain active critical and high severity patches', () => {
      expect(SAMPLE_PATCH_FEED.length).toBeGreaterThan(0);
      SAMPLE_PATCH_FEED.forEach(patch => {
        expect(patch.id).toMatch(/^PAT-\d{4}-\d{4}$/);
        expect(patch.cveId).toMatch(/^CVE-\d{4}-\d+$/);
        expect(patch.cvss).toBeGreaterThanOrEqual(7.0);
        expect(['CRITICAL', 'HIGH']).toContain(patch.severity);
        expect(patch.affectedDistros.length).toBeGreaterThan(0);
      });
    });

    it('should have complete Tier 1 Hot-Mitigations with ZERO downtime', () => {
      SAMPLE_PATCH_FEED.forEach(patch => {
        const tier1 = patch.remediationTier.tier1_hotMitigation;
        expect(tier1.downtimeRequired).toBe(false);
        expect(tier1.commands.length).toBeGreaterThan(0);
        expect(tier1.verificationCommand).toBeTruthy();
        expect(tier1.rollbackCommand).toBeTruthy();
        
        // Commands must not include reboot or shutdown
        tier1.commands.forEach(cmd => {
          expect(cmd.toLowerCase()).not.toContain('reboot');
          expect(cmd.toLowerCase()).not.toContain('shutdown');
          expect(cmd.toLowerCase()).not.toContain('poweroff');
        });
      });
    });

    it('should provide multi-distro Tier 2 atomic package commands', () => {
      SAMPLE_PATCH_FEED.forEach(patch => {
        const tier2 = patch.remediationTier.tier2_packageUpgrade;
        expect(Object.keys(tier2.distroCommands).length).toBeGreaterThan(0);
        
        // Verify common Linux distro commands exist and are actionable
        const distros = Object.keys(tier2.distroCommands);
        distros.forEach(d => {
          const cmd = tier2.distroCommands[d];
          expect(cmd).toBeTruthy();
          expect(cmd.length).toBeGreaterThan(15);
        });
      });
    });

    it('should provide valid Tier 3 Ansible Playbooks with rolling canary serial control', () => {
      SAMPLE_PATCH_FEED.forEach(patch => {
        const tier3 = patch.remediationTier.tier3_fleetAutomation;
        expect(tier3.ansiblePlaybook).toContain('---');
        expect(tier3.ansiblePlaybook).toContain('hosts:');
        expect(tier3.ansiblePlaybook).toContain('tasks:');
      });
    });

    it('should enforce SLSA Level 3 cryptographic provenance and test logs', () => {
      SAMPLE_PATCH_FEED.forEach(patch => {
        const prov = patch.provenance;
        expect(prov.slsaLevel).toBe(3);
        expect(prov.signedBy).toContain('@exultia.tech');
        expect(prov.cosignDigest).toMatch(/^sha256:[a-f0-9]{64}$/);
        expect(prov.testValidation.exitCode).toBe(0);
        expect(prov.testValidation.durationSec).toBeGreaterThan(0);
      });
    });
  });

  describe('API Endpoint Behavior & Filtering', () => {
    it('should serve default JSON feed with HTTP 200 and correct metadata', async () => {
      const req = new NextRequest('http://localhost:3000/api/patches/feed');
      const res = await GET(req);
      
      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.status).toBe('ok');
      expect(data.feedVersion).toBe('2.0.0');
      expect(data.totalActivePatches).toBe(SAMPLE_PATCH_FEED.length);
      expect(data.patches.length).toBe(SAMPLE_PATCH_FEED.length);
    });

    it('should filter patches by operating system', async () => {
      const reqRocky = new NextRequest('http://localhost:3000/api/patches/feed?os=rocky');
      const resRocky = await GET(reqRocky);
      const dataRocky = await resRocky.json();

      expect(resRocky.status).toBe(200);
      dataRocky.patches.forEach((p: any) => {
        expect(p.affectedDistros).toContain('rocky');
      });
    });

    it('should filter patches by severity', async () => {
      const reqCrit = new NextRequest('http://localhost:3000/api/patches/feed?severity=critical');
      const resCrit = await GET(reqCrit);
      const dataCrit = await resCrit.json();

      expect(resCrit.status).toBe(200);
      dataCrit.patches.forEach((p: any) => {
        expect(p.severity).toBe('CRITICAL');
      });
    });

    it('should generate executable POSIX shell script with format=bash', async () => {
      const reqBash = new NextRequest('http://localhost:3000/api/patches/feed?format=bash');
      const resBash = await GET(reqBash);
      
      expect(resBash.status).toBe(200);
      expect(resBash.headers.get('content-type')).toContain('text/plain');
      
      const bashScript = await resBash.text();
      expect(bashScript.startsWith('#!/bin/sh')).toBe(true);
      expect(bashScript).toContain('set -e');
      expect(bashScript).toContain('log "Starting rapid patch synchronization..."');
      expect(bashScript).toContain('Zero reboot required');

      // Verify that every Tier 1 command in the feed appears in the shell script
      SAMPLE_PATCH_FEED.forEach(patch => {
        expect(bashScript).toContain(patch.cveId);
        patch.remediationTier.tier1_hotMitigation.commands.forEach(cmd => {
          expect(bashScript).toContain(cmd);
        });
      });
    });
  });

});
