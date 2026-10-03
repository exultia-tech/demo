import { describe, it, expect } from "vitest";
import { compileRemediationBlock } from "@/lib/fix-list-compiler";
import { UviAdvisoryRecord } from "@/lib/threat-feed-data";

describe("FixList Compiler & Remediation Engine Tests", () => {
  const sampleNetworkAdvisory: UviAdvisoryRecord = {
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

  const samplePhishingAdvisory: UviAdvisoryRecord = {
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

    it("should format Juniper SRX prefix-list set statements", () => {
      const juniper = compileRemediationBlock(sampleNetworkAdvisory, "linux", "export", "juniper");
      expect(juniper).toContain("set policy-options prefix-list EXULTIA-BLOCK 192.0.2.1/32");
    });

    it("should format JSON output for SIEM/SOAR ingestion", () => {
      const jsonOutput = compileRemediationBlock(sampleNetworkAdvisory, "linux", "export", "json");
      expect(jsonOutput).toContain('"source": "Exultia Vantage"');
      expect(jsonOutput).toContain('"advisory": "UVI-2026-TEST-001"');
      expect(jsonOutput).toContain('"value": "192.0.2.1"');
    });
  });
});
