import { describe, it, expect } from 'vitest';
import { AiSupportEngine } from '../src/lib/ai-support-engine';

describe('Exultia Autonomous AI Support Agent & Per-Host Pricing Suite', () => {

  describe('1. Solo-Operator Transparency & SLA Avoidance Policy', () => {
    it('should refuse human SLAs and explain the solo-operator model when asked about SLAs', () => {
      const queries = [
        'Do you offer a 24/7 human SLA?',
        'Can I get an incident engineer on call for emergencies?',
        'What is your uptime guarantee SLA?',
        'Can I call someone on the phone if my server goes down?'
      ];

      for (const q of queries) {
        const res = AiSupportEngine.processQuery(q);
        expect(res.topic).toBe('sla');
        // Must explicitly state solo researcher / engineer model
        expect(res.reply).toMatch(/solo security researcher|solo maintainer|solo/i);
        // Must state no human SLAs or 24/7 pagers
        expect(res.reply).toMatch(/No Human SLAs/i);
        expect(res.reply).toMatch(/deterministic|automated/i);
        expect(res.reply).toMatch(/rollback/i);
        expect(res.suggestions.length).toBeGreaterThan(0);
      }
    });

    it('should never promise a dedicated human engineer or 24/7 pager phone response', () => {
      const res = AiSupportEngine.processQuery('I need a dedicated support engineer on a 15-minute response SLA');
      expect(res.reply).not.toMatch(/we will assign a dedicated incident engineer to your team/i);
      expect(res.reply).not.toMatch(/our 24\/7 call center will answer/i);
      expect(res.reply).toContain('No Human SLAs or 24/7 Pagers');
    });
  });

  describe('2. Kinetic Strictly Per-Host Pricing Calculations', () => {
    it('should explain the strictly per-host pricing model with 1 host free forever', () => {
      const res = AiSupportEngine.processQuery('How does Kinetic pricing work?');
      expect(res.topic).toBe('kinetic-pricing');
      expect(res.reply).toMatch(/\$49\s*\/host\/mo/i);
      expect(res.reply).toMatch(/\$149\s*\/host\/mo/i);
      expect(res.reply).toMatch(/1 Workstation \/ Host Node Free Forever/i);
      expect(res.reply).toMatch(/zero grouped node locks|no arbitrary/i);
    });

    it('should dynamically calculate exact monthly costs for 1 host', () => {
      const res = AiSupportEngine.processQuery('What is the cost for 1 host on Kinetic?');
      expect(res.reply).toMatch(/\$0\/mo.*Free forever/i);
    });

    it('should dynamically calculate exact monthly costs for 10 hosts', () => {
      const res = AiSupportEngine.processQuery('Calculate price for 10 hosts on Kinetic');
      expect(res.reply).toContain('$490/mo'); // 10 * 49
      expect(res.reply).toContain('$1490/mo'); // 10 * 149
    });

    it('should dynamically calculate exact monthly costs for 50 hosts', () => {
      const res = AiSupportEngine.processQuery('How much would 50 servers cost on Kinetic?');
      expect(res.reply).toContain('$2450/mo'); // 50 * 49
      expect(res.reply).toContain('$7450/mo'); // 50 * 149
    });

    it('should dynamically calculate exact monthly costs for 100 hosts', () => {
      const res = AiSupportEngine.processQuery('What is the fee for 100 nodes on Kinetic?');
      expect(res.reply).toContain('$4900/mo'); // 100 * 49
      expect(res.reply).toContain('$14900/mo'); // 100 * 149
    });
  });

  describe('3. Kinetic Daemon Installation Instructions', () => {
    it('should provide the curl bootstrap command and systemd unit instructions', () => {
      const res = AiSupportEngine.processQuery('How do I install the Kinetic daemon?');
      expect(res.topic).toBe('installation');
      expect(res.reply).toContain('curl -fsSL https://exultia.io/install/kinetic.sh');
      expect(res.reply).toContain('kinetic-daemon.service');
      expect(res.reply).toContain('systemctl enable --now kinetic-daemon');
      expect(res.reply).toContain('Ubuntu');
    });
  });

  describe('4. Deterministic Rollback Instructions', () => {
    it('should provide exact rollback commands and snapshot mechanics', () => {
      const res = AiSupportEngine.processQuery('How do I rollback a failed hotfix in Kinetic?');
      expect(res.topic).toBe('rollback');
      expect(res.reply).toContain('sudo kinetic rollback --cve=CVE-2024-3094');
      expect(res.reply).toContain('sudo kinetic rollback --latest');
      expect(res.reply).toContain('/var/lib/kinetic/snapshots/');
      expect(res.reply).toContain('SHA-256');
    });
  });

  describe('5. MultiPass & Product Inquiries', () => {
    it('should describe unified platform tiers (Professional Operator and Enterprise Fleet)', () => {
      const res = AiSupportEngine.processQuery('What is included in MultiPass?');
      expect(res.topic).toBe('multipass');
      expect(res.reply).toContain('$79');
      expect(res.reply).toContain('$499');
      expect(res.reply).toContain('PureIDE');
      expect(res.reply).toContain('Vantage');
      expect(res.reply).toContain('Praxis');
    });

    it('should describe the complete product suite when asked for an overview', () => {
      const res = AiSupportEngine.processQuery('Give me an overview of all Exultia products');
      expect(res.topic).toBe('products');
      expect(res.reply).toContain('PureIDE');
      expect(res.reply).toContain('Vantage');
      expect(res.reply).toContain('Kinetic');
      expect(res.reply).toContain('Argent');
      expect(res.reply).toContain('Praxis');
      expect(res.reply).toContain('PureOS');
      expect(res.reply).toContain('Axiom');
    });
  });

  describe('6. API Tokens & Authentication', () => {
    it('should explain where and how to generate service tokens', () => {
      const res = AiSupportEngine.processQuery('Where do I generate an API token?');
      expect(res.topic).toBe('tokens');
      expect(res.reply).toContain('/account');
      expect(res.reply).toContain('API Tokens');
      expect(res.reply).toContain('EX_TOKEN_');
    });
  });

  describe('7. Fallback Technical Assistant', () => {
    it('should provide a friendly technical greeting and suggestions for unfamiliar questions', () => {
      const res = AiSupportEngine.processQuery('Hello there');
      expect(res.topic).toBe('general');
      expect(res.reply).toContain('Exultia Technical AI Support Sentinel');
      expect(res.reply).toMatch(/solo-operator/i);
      expect(res.suggestions.length).toBeGreaterThan(0);
    });
  });

  describe('8. /api/support/chat Route Handler', () => {
    it('should process chat inquiries via POST route handler', async () => {
      const { POST } = await import('../src/app/api/support/chat/route');
      const req = new Request('http://localhost:3000/api/support/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: 'How does Kinetic per-host pricing work?' })
      });

      const response = await POST(req as any);
      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.topic).toBe('kinetic-pricing');
      expect(data.reply).toContain('$49 /host/mo');
      expect(Array.isArray(data.suggestions)).toBe(true);
    });

    it('should reject requests with empty message with 400 Bad Request', async () => {
      const { POST } = await import('../src/app/api/support/chat/route');
      const req = new Request('http://localhost:3000/api/support/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: '   ' })
      });

      const response = await POST(req as any);
      expect(response.status).toBe(400);
      const data = await response.json();
      expect(data.error).toBeDefined();
    });
  });
});
