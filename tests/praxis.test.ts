import { describe, it, expect } from "vitest";
import { compileRemediationBlock } from "@/lib/praxis-compiler";
import { 
  generateAfterActionCbom, 
  generateCbomShellScriptBlock, 
  convertAdvisoryToPatchItem 
} from "@/lib/praxis-cbom";
import { SAMPLE_PATCH_FEED } from "@/lib/patch-data";

describe("praxis Compiler & Remediation Engine Tests", () => {
  const sampleNetworkAdvisory: any = {
    uviId: "UVI-2026-TEST-001",
    title: "Test C2 Beacon Infrastructure",
    severity: "HIGH",
    cvssScore: 8.5,
    cveList: ["CVE-2026-9999"],
    attackVector: "NETWORK",
    cisaKev: { isKnownExploited: true, dateAdded: "2026-01-01" },
    remediation: {
      actionDirective: "ISOLATE_NETWORK_SEGMENT",
      recommendedAction: "Block C2 IP indicators and disable port 4444",
      patchAvailability: "AVAILABLE",
    },
    domainCategory: "NETWORK_PERIMETER",
    upstreamSignals: [{ signalType: "C2_BEACON", sourceFeedId: "alienvault_otx" }],
    affectedTargets: [],
    publishedDate: "2026-01-01",
    lastModifiedDate: "2026-01-02",
    description: "Malicious command and control server communicating with compromised hosts.",
    weaponizationStage: "ACTIVE_EXPLOITATION",
    exposureHorizon: "PERIMETER_EXPOSED",
    observationalRating: {
      behavioralRisk: "CRITICAL",
      exploitationReality: "CONFIRMED_ACTIVE",
      impactScope: "HOST_COMPROMISE",
    },
  };

  const samplePhishingAdvisory: any = {
    ...sampleNetworkAdvisory,
    uviId: "UVI-2026-TEST-002",
    title: "Executive Credential Harvest Domain",
    upstreamSignals: [{ signalType: "PHISHING_URL", sourceFeedId: "urlhaus" }],
  };

  describe("Localhost Firewall Dialect Compilation", () => {
    it("should generate iptables rules for Linux and Raspberry Pi", () => {
      const linuxScript = compileRemediationBlock(sampleNetworkAdvisory, "linux", "localhost");
      expect(linuxScript).toContain("iptables -A INPUT -p tcp --dport 4444 -j DROP");

      const rpiScript = compileRemediationBlock(sampleNetworkAdvisory, "rpi", "localhost");
      expect(rpiScript).toContain("iptables -A INPUT -p tcp --dport 4444 -j DROP");
    });

    it("should generate AIX genfilt rules for IBM AIX", () => {
      const aixScript = compileRemediationBlock(sampleNetworkAdvisory, "aix", "localhost");
      expect(aixScript).toContain("genfilt -v 4 -a D");
      expect(aixScript).toContain("AIX IPSec genfilt applied");
    });

    it("should generate ipfilter rules for Solaris and HP-UX", () => {
      const solarisScript = compileRemediationBlock(sampleNetworkAdvisory, "solaris", "localhost");
      expect(solarisScript).toContain("ipf -f -");
      expect(solarisScript).toContain("block in quick proto tcp");

      const hpuxScript = compileRemediationBlock(sampleNetworkAdvisory, "hpux", "localhost");
      expect(hpuxScript).toContain("ipf -f -");
    });

    it("should apply /etc/hosts domain sinkholing for phishing indicators", () => {
      const phishScript = compileRemediationBlock(samplePhishingAdvisory, "linux", "localhost");
      expect(phishScript).toContain("/etc/hosts");
      expect(phishScript).toContain("0.0.0.0 malicious-phishing-domain.example");
    });
  });

  describe("Enterprise Firewall Export Formats", () => {
    it("should format Cisco IOS ACL commands correctly", () => {
      const cisco = compileRemediationBlock(sampleNetworkAdvisory, "linux", "export", "cisco");
      expect(cisco).toContain("Cisco IOS ACL");
      expect(cisco).toContain("deny ip host 192.0.2.1 any");
    });

    it("should format Palo Alto EDL one-per-line entries", () => {
      const palo = compileRemediationBlock(sampleNetworkAdvisory, "linux", "export", "paloalto");
      expect(palo).toContain("Palo Alto EDL");
      expect(palo).toContain("192.0.2.1");
    });

    it("should format Fortinet CLI address group configurations", () => {
      const forti = compileRemediationBlock(sampleNetworkAdvisory, "linux", "export", "fortinet");
      expect(forti).toContain("Fortinet address group");
      expect(forti).toContain('edit "UVI-2026-TEST-001-192.0.2.1"');
      expect(forti).toContain("set subnet 192.0.2.1 255.255.255.255");
    });

    it("should format Juniper SRX prepraxis set statements", () => {
      const juniper = compileRemediationBlock(sampleNetworkAdvisory, "linux", "export", "juniper");
      expect(juniper).toContain("set policy-options prepraxis EXULTIA-BLOCK 192.0.2.1/32");
    });

    it("should format JSON output for SIEM/SOAR ingestion", () => {
      const jsonOutput = compileRemediationBlock(sampleNetworkAdvisory, "linux", "export", "json");
      expect(jsonOutput).toContain('"source": "Exultia Vantage"');
      expect(jsonOutput).toContain('"advisory": "UVI-2026-TEST-001"');
      expect(jsonOutput).toContain('"value": "192.0.2.1"');
    });
  });

  describe("After-Action CBOM Manifest Generation", () => {
    it("should synthesize a valid CycloneDX-CBOM structure for remediation", () => {
      const cbom = generateAfterActionCbom({
        os: "linux",
        executionType: "remediation",
        advisories: [sampleNetworkAdvisory],
        classes: ["network", "phishing"],
        cron: true
      });

      expect(cbom.cbomFormat).toBe("CycloneDX-CBOM");
      expect(cbom.specVersion).toBe("1.5");
      expect(cbom.serialNumber).toMatch(/^urn:uuid:/);
      expect(cbom.targetHost.os).toBe("linux");
      expect(cbom.targetHost.cronScheduled).toBe(true);
      expect(cbom.vulnerabilitiesRemediated.length).toBeGreaterThanOrEqual(1);
      expect(cbom.vulnerabilitiesRemediated[0].uviId).toBe("UVI-2026-TEST-001");
      expect(cbom.provenance.slsaLevel).toBe(3);
      expect(cbom.provenance.cosignDigest).toMatch(/^sha256:/);
    });

    it("should synthesize a valid CycloneDX-CBOM structure for patching", () => {
      const cbom = generateAfterActionCbom({
        os: "linux",
        executionType: "patching",
        selectedPatch: SAMPLE_PATCH_FEED[0]
      });

      expect(cbom.cbomFormat).toBe("CycloneDX-CBOM");
      expect(cbom.executionType).toBe("patching");
      expect(cbom.vulnerabilitiesRemediated[0].cveId).toBe(SAMPLE_PATCH_FEED[0].cveId);
      expect(cbom.actionsPerformed.some(a => a.actionType === "HOTPATCH")).toBe(true);
    });

    it("should generate shell script block to write After-Action CBOM payload to /var/log/exultia", () => {
      const cbom = generateAfterActionCbom({
        os: "linux",
        executionType: "remediation",
        advisories: [sampleNetworkAdvisory]
      });
      const shellBlock = generateCbomShellScriptBlock(cbom);

      expect(shellBlock).toContain("write_after_action_cbom");
      expect(shellBlock).toContain('CBOM_DIR="/var/log/exultia"');
      expect(shellBlock).toContain('praxis-cbom-after-action.json');
      expect(shellBlock).toContain('"CycloneDX-CBOM"');
      expect(shellBlock).toContain("EP_HOST=$(hostname");
      expect(shellBlock).toContain("EP_KERNEL=$(uname -r");
      expect(shellBlock).toContain("__EP_HOST__");
    });

    it("should include endpointExecution metadata in the generated CBOM", () => {
      const cbom = generateAfterActionCbom({
        os: "linux",
        executionType: "remediation",
        advisories: [sampleNetworkAdvisory]
      });

      expect(cbom.endpointExecution).toBeDefined();
      expect(cbom.endpointExecution?.targetNode).toBe("evaluated-on-endpoint (dynamic)");
      expect(cbom.endpointExecution?.status).toBe("SUCCESS");
    });

    it("should seamlessly convert arbitrary Vantage advisories into valid PatchFeedItems with endpoint CBOM writers", () => {
      const patchItem = convertAdvisoryToPatchItem(sampleNetworkAdvisory);

      expect(patchItem.cveId).toBe("CVE-2026-9999");
      expect(patchItem.severity).toBe("HIGH");
      expect(patchItem.remediationTier.tier1_hotMitigation.commands.length).toBeGreaterThan(0);
      expect(patchItem.remediationTier.tier1_hotMitigation.commands.some(c => c.includes("praxis-cbom-after-action.json"))).toBe(true);
      expect(patchItem.remediationTier.tier3_fleetAutomation.ansiblePlaybook).toContain("Codify After-Action CBOM on Target Endpoint");
      expect(patchItem.remediationTier.tier3_fleetAutomation.ansiblePlaybook).toContain("/var/log/exultia/praxis-cbom-after-action.json");
      expect(patchItem.provenance.slsaLevel).toBe(3);
    });

    it("should ensure sample patch feed items write CBOM to target endpoint in Tier 1 and Tier 3", () => {
      for (const patch of SAMPLE_PATCH_FEED) {
        expect(patch.remediationTier.tier1_hotMitigation.commands.some(c => c.includes("praxis-cbom-after-action.json"))).toBe(true);
        expect(patch.remediationTier.tier3_fleetAutomation.ansiblePlaybook).toContain("/var/log/exultia/praxis-cbom-after-action.json");
      }
    });
  });
});
