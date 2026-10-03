import { describe, it, expect, afterAll } from "vitest";
import { IDE_ENGINES } from "@/app/app/pureide/page";
import { generateCycloneDX } from "@/lib/sbom";
import fs from "fs";
import path from "path";
import os from "os";

describe("PureIDE Module: Zero-Trust Multi-Engine IDE Packager", () => {
  const testOutputPath = path.join(os.tmpdir(), `pureide-test-sbom-${Date.now()}.json`);

  afterAll(() => {
    try {
      if (fs.existsSync(testOutputPath)) fs.unlinkSync(testOutputPath);
    } catch {}
  });

  describe("Multi-Engine Definitions", () => {
    it("should configure all five supported IDE engines", () => {
      const engineIds = IDE_ENGINES.map((e) => e.id);
      expect(engineIds).toEqual(["vscode", "theia", "zed", "neovim", "jupyter"]);

      for (const engine of IDE_ENGINES) {
        expect(engine.name.length).toBeGreaterThan(0);
        expect(engine.shortName.length).toBeGreaterThan(0);
        expect(engine.tagline.length).toBeGreaterThan(0);
        expect(engine.icon.length).toBeGreaterThan(0);
        expect(engine.badge.length).toBeGreaterThan(0);
        expect(engine.description.length).toBeGreaterThan(0);
      }
    });

    it("should provide correct core attributes for each engine ecosystem", () => {
      const vscode = IDE_ENGINES.find((e) => e.id === "vscode");
      expect(vscode?.badge).toBe("VSIX Core");

      const zed = IDE_ENGINES.find((e) => e.id === "zed");
      expect(zed?.badge).toBe("Rust GPU");

      const neovim = IDE_ENGINES.find((e) => e.id === "neovim");
      expect(neovim?.badge).toBe("LazyVim / Lua");
    });
  });

  describe("SBOM & Zero-Trust Integrity Engine", () => {
    it("should generate a valid CycloneDX SBOM structure with metadata and hashes", () => {
      const res = generateCycloneDX({
        dist: "./nonexistent-dir",
        brand: "PureIDE-Hardened",
        tier: "Enterprise",
        engine: "vscode",
        os: "linux",
        output: testOutputPath,
      });

      expect(res.success).toBe(true);
      expect(res.sbom.bomFormat).toBe("CycloneDX");
      expect(res.sbom.specVersion).toBe("1.5");
      expect(res.sbom.serialNumber).toMatch(/^urn:uuid:/);
      expect(res.sbom.metadata.component.name).toBe("PureIDE-Hardened");
    });
  });
});
