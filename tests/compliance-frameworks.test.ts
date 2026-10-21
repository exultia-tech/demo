import { describe, it, expect } from "vitest";
import { 
  COMPLIANCE_FRAMEWORKS, 
  COMPLIANCE_DOMAINS, 
  AUDIT_CHECKLIST_DATA 
} from "@/lib/compliance/complianceFrameworksData";

describe("Exultia Compendium: Compliance Frameworks & Auditor Engine", () => {
  it("should have metadata for all 8 mandatory regulatory frameworks", () => {
    expect(COMPLIANCE_FRAMEWORKS.length).toBe(8);
    const ids = COMPLIANCE_FRAMEWORKS.map(f => f.id);
    expect(ids).toContain("nist-800-53");
    expect(ids).toContain("iso-27001");
    expect(ids).toContain("soc-2");
    expect(ids).toContain("pci-dss");
    expect(ids).toContain("hipaa");
    expect(ids).toContain("sox-itgc");
    expect(ids).toContain("gdpr");
    expect(ids).toContain("cmmc");
  });

  it("should define all 8 operational security domains", () => {
    expect(COMPLIANCE_DOMAINS.length).toBe(8);
    const domainIds = COMPLIANCE_DOMAINS.map(d => d.id);
    expect(domainIds).toContain("iam");
    expect(domainIds).toContain("devsecops");
    expect(domainIds).toContain("secops");
    expect(domainIds).toContain("workstation");
    expect(domainIds).toContain("cryptography");
    expect(domainIds).toContain("logging");
    expect(domainIds).toContain("incident-resp");
    expect(domainIds).toContain("vendor-risk");
  });

  it("should include plain-English requirements and auditor questions for all controls", () => {
    expect(AUDIT_CHECKLIST_DATA.length).toBeGreaterThanOrEqual(20);

    AUDIT_CHECKLIST_DATA.forEach(ctrl => {
      expect(ctrl.id).toBeDefined();
      expect(ctrl.title).toBeDefined();
      expect(ctrl.plainEnglishRequirement.length).toBeGreaterThan(20);
      expect(ctrl.auditorQuestion.length).toBeGreaterThan(15);
      expect(ctrl.whyItMatters.length).toBeGreaterThan(20);
      expect(ctrl.evidenceArtifacts.length).toBeGreaterThan(0);
      expect(ctrl.sampleCliVerification.length).toBeGreaterThan(5);

      // Verify cross-framework citations are present
      expect(ctrl.mappings.nist80053).toBeDefined();
      expect(ctrl.mappings.iso27001).toBeDefined();
      expect(ctrl.mappings.soc2).toBeDefined();
      expect(ctrl.mappings.pciDss).toBeDefined();
      expect(ctrl.mappings.hipaa).toBeDefined();
      expect(ctrl.mappings.soxItgc).toBeDefined();
      expect(ctrl.mappings.gdpr).toBeDefined();
      expect(ctrl.mappings.cmmc).toBeDefined();
    });
  });

  it("should enforce critical priority on fundamental controls (MFA, Encryption, Segregation, Backups)", () => {
    const mfaCtrl = AUDIT_CHECKLIST_DATA.find(c => c.id === "CTRL-IAM-01");
    expect(mfaCtrl?.priority).toBe("CRITICAL");

    const branchProt = AUDIT_CHECKLIST_DATA.find(c => c.id === "CTRL-DEV-01");
    expect(branchProt?.priority).toBe("CRITICAL");

    const encInTransit = AUDIT_CHECKLIST_DATA.find(c => c.id === "CTRL-DAT-01");
    expect(encInTransit?.priority).toBe("CRITICAL");

    const backups = AUDIT_CHECKLIST_DATA.find(c => c.id === "CTRL-IR-02");
    expect(backups?.priority).toBe("CRITICAL");
  });
});
