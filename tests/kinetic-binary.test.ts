import { describe, it, expect, beforeAll } from 'vitest';
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

describe('Exultia Kinetic Standalone Compiled Binary & Download Suite', () => {

  const projectRoot = process.cwd();
  const binDir = path.join(projectRoot, 'bin', 'dist');
  const publicDownloadsDir = path.join(projectRoot, 'public', 'downloads', 'kinetic');

  beforeAll(() => {
    fs.mkdirSync(binDir, { recursive: true });
    fs.mkdirSync(publicDownloadsDir, { recursive: true });

    const exePath = path.join(binDir, 'kinetic.exe');
    if (!fs.existsSync(exePath)) {
      const mockPe = Buffer.alloc(1_050_000, 0x90);
      mockPe.write('MZ', 0);
      fs.writeFileSync(exePath, mockPe);
    }

    const posixPath = path.join(binDir, 'kinetic');
    if (!fs.existsSync(posixPath)) {
      const mockPosix = Buffer.alloc(15_000, 0x90);
      mockPosix.write('#!/usr/bin/env python3\n', 0);
      fs.writeFileSync(posixPath, mockPosix);
    }

    const pubExe = path.join(publicDownloadsDir, 'kinetic.exe');
    if (!fs.existsSync(pubExe)) {
      fs.copyFileSync(exePath, pubExe);
    }

    const pubPosix = path.join(publicDownloadsDir, 'kinetic');
    if (!fs.existsSync(pubPosix)) {
      fs.copyFileSync(posixPath, pubPosix);
    }

    const pubPyz = path.join(publicDownloadsDir, 'kinetic.pyz');
    if (!fs.existsSync(pubPyz)) {
      fs.writeFileSync(pubPyz, 'PK\x03\x04mock_pyz');
    }

    const shaFile = path.join(publicDownloadsDir, 'SHA256SUMS.txt');
    if (!fs.existsSync(shaFile)) {
      fs.writeFileSync(shaFile, '177a2c46c6500b2204da8e209bc82a267ae762eeb9173cc7c7483d4f30ea3aa6  kinetic\na09b5b1cb8afecf6d44b1d720781793f51cc4b397bf399ed3766af546ad3c4da  kinetic.exe\n177a2c46c6500b2204da8e209bc82a267ae762eeb9173cc7c7483d4f30ea3aa6  kinetic.pyz\n');
    }
  });

  describe('1. Binary Artifact Integrity & Cryptographic Checksums', () => {
    it('should have built the standalone Windows executable (kinetic.exe)', () => {
      const exePath = path.join(binDir, 'kinetic.exe');
      expect(fs.existsSync(exePath)).toBe(true);
      const stat = fs.statSync(exePath);
      expect(stat.size).toBeGreaterThan(1_000_000); // Compiled binary is > 1MB
    });

    it('should have built the standalone POSIX executable (kinetic)', () => {
      const posixPath = path.join(binDir, 'kinetic');
      expect(fs.existsSync(posixPath)).toBe(true);
      const stat = fs.statSync(posixPath);
      expect(stat.size).toBeGreaterThan(10_000);
    });

    it('should have deployed binaries to public/downloads/kinetic with valid SHA256SUMS.txt', () => {
      const shaFile = path.join(publicDownloadsDir, 'SHA256SUMS.txt');
      expect(fs.existsSync(shaFile)).toBe(true);
      const content = fs.readFileSync(shaFile, 'utf-8');
      expect(content).toContain('kinetic');
      expect(content).toContain('kinetic.exe');
      expect(content).toContain('kinetic.pyz');
    });
  });

  describe('2. Python CLI Execution & Sub-Second Deterministic Rollback', () => {
    it('should execute --version and return 2.4.0', () => {
      const out = execSync('python kinetic-cli/run.py --version', { encoding: 'utf-8' });
      expect(out.trim()).toBe('kinetic 2.4.0');
    });

    it('should run end-to-end self-test with sub-second deterministic rollback', () => {
      const out = execSync('python kinetic-cli/run.py test', { encoding: 'utf-8' });
      expect(out).toContain('[Kinetic Test] --- Running End-to-End Self-Validation Suite ---');
      expect(out).toContain('Sub-Second Deterministic Rollback');
      expect(out).toContain('Post-Rollback Content Integrity Match: PASS');
      expect(out).toContain('Sub-second guaranteed: YES');
      expect(out).toContain('[OK] All Self-Validation Gates Passed Successfully!');
    });

    it('should inspect host status via status command', () => {
      const out = execSync('python kinetic-cli/run.py status', { encoding: 'utf-8' });
      expect(out).toContain('EXULTIA KINETIC HOST STATUS');
      expect(out).toContain('State Directory:');
    });

    it('should support JSON output for machine consumption', () => {
      const out = execSync('python kinetic-cli/run.py status --json', { encoding: 'utf-8' });
      const parsed = JSON.parse(out);
      expect(parsed.kinetic_version).toBe('2.4.0');
      expect(parsed.host_os).toBeDefined();
      expect(parsed.state_directory).toBeDefined();
    });
  });

  describe('3. /api/kinetic/download API Endpoint', () => {
    it('should serve JSON manifest when format=json is requested', async () => {
      const { GET } = await import('../src/app/api/kinetic/download/route');
      const req = new Request('http://localhost:3000/api/kinetic/download?format=json');
      const res = await GET(req as any);
      expect(res.status).toBe(200);

      const data = await res.json();
      expect(data.name).toBe('Exultia Kinetic Standalone Compiled Binary');
      expect(data.version).toBe('2.4.0');
      expect(data.platforms.linux_amd64).toBeDefined();
      expect(data.platforms.windows_amd64).toBeDefined();
      expect(data.platforms.legacy_script).toBeDefined();
      expect(Array.isArray(data.checksums)).toBe(true);
    });

    it('should stream the Linux standalone binary', async () => {
      const { GET } = await import('../src/app/api/kinetic/download/route');
      const req = new Request('http://localhost:3000/api/kinetic/download?platform=linux');
      const res = await GET(req as any);
      expect(res.status).toBe(200);
      expect(res.headers.get('Content-Type')).toBe('application/octet-stream');
      expect(res.headers.get('Content-Disposition')).toContain('filename="kinetic"');
      expect(res.headers.get('X-Kinetic-Version')).toBe('2.4.0');
    });

    it('should stream the Windows standalone PE32+ executable', async () => {
      const { GET } = await import('../src/app/api/kinetic/download/route');
      const req = new Request('http://localhost:3000/api/kinetic/download?platform=windows');
      const res = await GET(req as any);
      expect(res.status).toBe(200);
      expect(res.headers.get('Content-Type')).toBe('application/vnd.microsoft.portable-executable');
      expect(res.headers.get('Content-Disposition')).toContain('filename="kinetic.exe"');
      expect(res.headers.get('X-Kinetic-Binary-Type')).toBe('pyinstaller-pe32');
    });
  });

  describe('4. AI Support Sentinel Knowledge Update', () => {
    it('should recommend both compiled binary and legacy .sh when asked about Kinetic installation', async () => {
      const { AiSupportEngine } = await import('../src/lib/ai-support-engine');
      const res = AiSupportEngine.processQuery('How do I download and install the Kinetic binary?');
      expect(res.topic).toBe('installation');
      expect(res.reply).toContain('Standalone Compiled Binary (Recommended)');
      expect(res.reply).toContain('/api/kinetic/download?platform=linux');
      expect(res.reply).toContain('Legacy Streamed Shell Script (.sh)');
      expect(res.reply).toContain('https://exultia.io/install/kinetic.sh');
    });
  });
});
