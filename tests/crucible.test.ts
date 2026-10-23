import { describe, it, expect } from "vitest";
import {
  CRUCIBLE_MODULES,
  VULNERABLE_CONTAINER_SCENARIOS,
  CRUCIBLE_COMPOSE_MANIFEST,
  CRUCIBLE_MANDATORY_DISCLAIMER,
  compileCrucibleChaosScript
} from "@/lib/crucible-data";

describe("Crucible: Controlled Vulnerability Proving Ground Tests", () => {

  describe("Safety & Legal Disclaimers", () => {
    it("should export mandatory disclaimer with strict non-production warnings", () => {
      expect(CRUCIBLE_MANDATORY_DISCLAIMER.title).toContain("MANDATORY TESTING NOTICE");
      expect(CRUCIBLE_MANDATORY_DISCLAIMER.shortWarning).toContain("RESTRICTED TO ISOLATED TESTING");
      expect(CRUCIBLE_MANDATORY_DISCLAIMER.bodyText).toContain("DO NOT EXECUTE THESE SCRIPTS ON PRODUCTION SYSTEMS");
      expect(CRUCIBLE_MANDATORY_DISCLAIMER.termsCheckboxText).toContain("I acknowledge that Crucible intentionally breaks security baselines");
    });
  });

  describe("Crucible Modules Catalog", () => {
    it("should define critical vulnerability and misconfiguration modules", () => {
      expect(CRUCIBLE_MODULES.length).toBeGreaterThanOrEqual(7);

      const moduleIds = CRUCIBLE_MODULES.map(m => m.id);
      expect(moduleIds).toContain("ssh_permissive_regresshion");
      expect(moduleIds).toContain("rogue_c2_listeners");
      expect(moduleIds).toContain("unauthorized_tmp_executables");
      expect(moduleIds).toContain("phishing_hosts_spoofing");
      expect(moduleIds).toContain("cups_browsed_listener");
      expect(moduleIds).toContain("defense_flush_permissive");
      expect(moduleIds).toContain("backdoor_tester_account");
    });

    it("should pair every Crucible module with an actionable Praxis countermeasure", () => {
      for (const mod of CRUCIBLE_MODULES) {
        expect(mod.praxisRemediationClass).toBeDefined();
        expect(mod.praxisRemediationClass.length).toBeGreaterThanOrEqual(3);
        expect(mod.setupCommands.length).toBeGreaterThan(0);
        expect(mod.teardownCommands.length).toBeGreaterThan(0);
      }
    });
  });

  describe("Chaos Inoculation Script Compiler", () => {
    it("should compile a valid bash script with shebang, safety checks, and rollback", () => {
      const { script, activeModules, rollbackCommand } = compileCrucibleChaosScript("ubuntu");

      expect(script).toContain("#!/usr/bin/env bash");
      expect(script).toContain("MANDATORY TESTING DISCLAIMER");
      expect(script).toContain("crucible_rollback() {");
      expect(script).toContain('if [ "$1" = "--rollback" ]');
      expect(script).toContain('"$CRUCIBLE_DIR/crucible-manifest.json"');
      expect(rollbackCommand).toBe("/var/log/crucible/crucible-setup.sh --rollback");
      expect(activeModules.length).toBeGreaterThan(0);
    });

    it("should selectively compile only requested modules", () => {
      const selected = ["ssh_permissive_regresshion", "rogue_c2_listeners"];
      const { script, activeModules } = compileCrucibleChaosScript("debian", selected, 15);

      expect(activeModules.map(m => m.id)).toEqual(selected);
      expect(script).toContain("99-crucible-vulnerable-sshd.conf");
      expect(script).toContain("4444");
      expect(script).toContain("at now + 15 minutes");
      // Should not contain unselected modules
      expect(script).not.toContain("crucible_tester");
    });

    it("should include clean teardown commands in the rollback function", () => {
      const { script } = compileCrucibleChaosScript("ubuntu", ["ssh_permissive_regresshion", "backdoor_tester_account"]);

      expect(script).toContain("rm -f /etc/ssh/sshd_config.d/99-crucible-vulnerable-sshd.conf");
      expect(script).toContain("userdel -r crucible_tester");
      expect(script).toContain("Host restored to clean baseline state");
    });

    it("should support disabling the auto-rollback timer", () => {
      const { script } = compileCrucibleChaosScript("ubuntu", undefined, 0);
      expect(script).not.toContain("at now + 0 minutes");
    });
  });

  describe("Preconfigured Vulnerable Containers", () => {
    it("should provide Docker recipes for high-profile vulnerabilities", () => {
      expect(VULNERABLE_CONTAINER_SCENARIOS.length).toBe(4);

      const cveIds = VULNERABLE_CONTAINER_SCENARIOS.map(s => s.cveId);
      expect(cveIds).toContain("CVE-2024-6387"); // RegreSSHion
      expect(cveIds).toContain("CVE-2024-47176"); // CUPS browsed
      expect(cveIds).toContain("CVE-2024-3094");  // XZ utils
      expect(cveIds).toContain("CVE-2021-44228"); // Log4Shell

      for (const scenario of VULNERABLE_CONTAINER_SCENARIOS) {
        expect(scenario.dockerRunCommand).toContain("docker run");
        expect(scenario.verificationCommand.length).toBeGreaterThan(5);
        expect(scenario.dockerfile).toContain("FROM ");
        expect(scenario.praxisRemediationTier).toContain("tier1_hotMitigation");
      }
    });

    it("should export a complete docker-compose.yml testing range", () => {
      expect(CRUCIBLE_COMPOSE_MANIFEST).toContain("version: '3.8'");
      expect(CRUCIBLE_COMPOSE_MANIFEST).toContain("container_name: crucible-regresshion");
      expect(CRUCIBLE_COMPOSE_MANIFEST).toContain("container_name: crucible-cups");
      expect(CRUCIBLE_COMPOSE_MANIFEST).toContain("container_name: crucible-xz");
      expect(CRUCIBLE_COMPOSE_MANIFEST).toContain("container_name: crucible-log4shell");
      expect(CRUCIBLE_COMPOSE_MANIFEST).toContain("crucible-range:");
    });
  });

});
