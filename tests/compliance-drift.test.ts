import { describe, it, expect } from 'vitest';
import { AUTHORITATIVE_SOX_PCI_CONTROLS, getControlsForStandard } from '@/lib/compliance-drift';
import { GET as getDriftApi, POST as postDriftApi } from '@/app/api/praxis/drift/route';
import { GET as getPraxisClient } from '@/app/api/praxis/client/route';
import { NextRequest } from 'next/server';
import { execSync } from 'child_process';

describe('Exultia SOX & PCI-DSS Configuration Drift Auto-Reversion Suite', () => {

  describe('1. Authoritative Compliance Controls & Metadata', () => {
    it('should define all core SOX ITGC and PCI-DSS v4.0 controls', () => {
      expect(AUTHORITATIVE_SOX_PCI_CONTROLS.length).toBeGreaterThanOrEqual(13);

      const sshControls = AUTHORITATIVE_SOX_PCI_CONTROLS.filter(c => c.category === 'SSH');
      const sysctlControls = AUTHORITATIVE_SOX_PCI_CONTROLS.filter(c => c.category === 'SYSCTL');
      const permControls = AUTHORITATIVE_SOX_PCI_CONTROLS.filter(c => c.category === 'PERMISSIONS');
      const acctControls = AUTHORITATIVE_SOX_PCI_CONTROLS.filter(c => c.category === 'ACCOUNT');

      expect(sshControls.length).toBeGreaterThanOrEqual(4);
      expect(sysctlControls.length).toBeGreaterThanOrEqual(5);
      expect(permControls.length).toBeGreaterThanOrEqual(4);
      expect(acctControls.length).toBeGreaterThanOrEqual(2);
    });

    it('should correctly filter controls by compliance standard', () => {
      const all = getControlsForStandard('sox_pci');
      const pci = getControlsForStandard('pci');
      const sox = getControlsForStandard('sox');

      expect(all.length).toBe(AUTHORITATIVE_SOX_PCI_CONTROLS.length);
      expect(pci.length).toBeGreaterThan(0);
      expect(sox.length).toBeGreaterThan(0);

      pci.forEach(c => {
        expect(c.standards.some(s => s.toLowerCase().includes('pci'))).toBe(true);
      });

      sox.forEach(c => {
        expect(c.standards.some(s => s.toLowerCase().includes('sox'))).toBe(true);
      });
    });

    it('should include specific strict invariants (PermitRootLogin no, net.ipv4.ip_forward=0, 0600 shadow)', () => {
      const rootLogin = AUTHORITATIVE_SOX_PCI_CONTROLS.find(c => c.id === 'SOX-PCI-SSH-01');
      expect(rootLogin?.desiredValue).toBe('PermitRootLogin no');
      expect(rootLogin?.standards).toContain('PCI-DSS-v4.0-2.2.4');

      const ipFwd = AUTHORITATIVE_SOX_PCI_CONTROLS.find(c => c.id === 'SOX-PCI-SYSCTL-01');
      expect(ipFwd?.desiredValue).toBe('net.ipv4.ip_forward = 0');

      const shadow = AUTHORITATIVE_SOX_PCI_CONTROLS.find(c => c.id === 'SOX-PCI-PERM-01');
      expect(shadow?.targetPath).toBe('/etc/shadow');
    });
  });

  describe('2. /api/praxis/drift API Route Handlers', () => {
    it('should return live drift baseline and invariants via GET', async () => {
      const req = new NextRequest('http://localhost:3000/api/praxis/drift?standard=sox_pci');
      const res = await getDriftApi(req);
      expect(res.status).toBe(200);

      const json = await res.json();
      expect(json.status).toBe('ACTIVE_SENTINEL');
      expect(json.standard).toBe('SOX_PCI');
      expect(json.totalInvariantsEnforced).toBeGreaterThanOrEqual(13);
      expect(json.coverage.soxItgc).toBeGreaterThan(0);
      expect(json.coverage.pciDss).toBeGreaterThan(0);
      expect(json.controls.length).toBe(json.totalInvariantsEnforced);
    });

    it('should filter categories in GET request', async () => {
      const req = new NextRequest('http://localhost:3000/api/praxis/drift?category=ssh');
      const res = await getDriftApi(req);
      const json = await res.json();

      expect(json.controls.every((c: any) => c.category === 'SSH')).toBe(true);
    });

    it('should simulate audit via POST /api/praxis/drift', async () => {
      const req = new NextRequest('http://localhost:3000/api/praxis/drift', {
        method: 'POST',
        body: JSON.stringify({ action: 'audit', standard: 'sox_pci' }),
        headers: { 'Content-Type': 'application/json' }
      });
      const res = await postDriftApi(req);
      expect(res.status).toBe(200);

      const json = await res.json();
      expect(json.action).toBe('AUDIT');
      expect(json.status).toBe('COMPLIANT');
    });

    it('should execute drift reconciliation via POST /api/praxis/drift', async () => {
      const req = new NextRequest('http://localhost:3000/api/praxis/drift', {
        method: 'POST',
        body: JSON.stringify({ action: 'revert', standard: 'sox_pci' }),
        headers: { 'Content-Type': 'application/json' }
      });
      const res = await postDriftApi(req);
      expect(res.status).toBe(200);

      const json = await res.json();
      expect(json.action).toBe('REVERT_DRIFT');
      expect(json.totalReconciled).toBeGreaterThanOrEqual(13);
      expect(json.subSecondDeterministic).toBe(true);
      expect(json.reconciledControls.length).toBe(json.totalReconciled);
    });
  });

  describe('3. Exultia Lightweight Praxis Client Drift Embedding', () => {
    it('should embed autonomous drift reconciliation routine when drift is enabled (default)', async () => {
      const req = new NextRequest('http://localhost:3000/api/praxis/client?os=linux');
      const res = await getPraxisClient(req);
      expect(res.status).toBe(200);

      const text = await res.text();
      expect(text).toContain('reconcile_compliance_drift()');
      expect(text).toContain('PermitRootLogin no');
      expect(text).toContain('net.ipv4.ip_forward = 0');
      expect(text).toContain('/etc/shadow');
      expect(text).toContain('chmod 600 /etc/shadow');
      expect(text).toContain('reconcile_compliance_drift');
    });

    it('should omit drift reconciliation routine when drift is toggled off (?drift=false)', async () => {
      const req = new NextRequest('http://localhost:3000/api/praxis/client?os=linux&drift=false');
      const res = await getPraxisClient(req);
      expect(res.status).toBe(200);

      const text = await res.text();
      expect(text).not.toContain('reconcile_compliance_drift()');
      expect(text).toContain('fetch_and_apply');
    });
  });

  describe('4. Standalone Kinetic CLI Drift Subcommands', () => {
    it('should execute `kinetic drift audit --json` and output valid structured JSON', () => {
      const out = execSync('python kinetic-cli/run.py drift audit --json', { encoding: 'utf-8' });
      const parsed = JSON.parse(out);
      expect(Array.isArray(parsed)).toBe(true);
      if (parsed.length > 0) {
        expect(parsed[0]).toHaveProperty('controlId');
        expect(parsed[0]).toHaveProperty('standards');
        expect(parsed[0]).toHaveProperty('desiredValue');
      }
    });

    it('should execute `kinetic drift revert --dry-run` and report reconciled controls', () => {
      const out = execSync('python kinetic-cli/run.py drift revert --dry-run', { encoding: 'utf-8' });
      expect(out).toContain('[Kinetic Drift Sentinel]');
      expect(out.includes('reconciled') || out.includes('Nothing to reconcile')).toBe(true);
    });
  });

});
