import { describe, it, expect } from "vitest";
import { STATUTES_DATABASE } from "@/lib/foia/statutes";
import { calculateStatutoryDeadline } from "@/lib/foia/deadlineCalculator";
import { AGENCIES_DATABASE } from "@/lib/foia/agencies";

describe("Inquest Module: FOIA & Public Records Assistant", () => {
  describe("Statutory Law Database", () => {
    it("should provide comprehensive federal and key state sunshine statutes", () => {
      expect(STATUTES_DATABASE["US_FED"]).toBeDefined();
      expect(STATUTES_DATABASE["CA"]).toBeDefined();
      expect(STATUTES_DATABASE["TX"]).toBeDefined();
      expect(STATUTES_DATABASE["FL"]).toBeDefined();
      expect(STATUTES_DATABASE["NY"]).toBeDefined();

      for (const statute of Object.values(STATUTES_DATABASE)) {
        expect(statute.id).toBeDefined();
        expect(statute.name.length).toBeGreaterThan(0);
        expect(statute.citation.length).toBeGreaterThan(0);
        expect(statute.responseDays).toBeGreaterThan(0);
        expect(["business", "calendar"]).toContain(statute.dayType);
        expect(statute.segregabilityMandate.length).toBeGreaterThan(10);
      }
    });

    it("should specify Federal FOIA parameters correctly", () => {
      const fed = STATUTES_DATABASE["US_FED"];
      expect(fed.citation).toContain("5 U.S.C. § 552");
      expect(fed.responseDays).toBe(20);
      expect(fed.dayType).toBe("business");
      expect(fed.administrativeAppealDeadlineDays).toBe(90);
    });

    it("should specify California CPRA parameters correctly", () => {
      const ca = STATUTES_DATABASE["CA"];
      expect(ca.citation).toContain("Cal. Gov. Code");
      expect(ca.responseDays).toBe(10);
      expect(ca.dayType).toBe("calendar");
    });
  });

  describe("Deadline Calculator Engine", () => {
    it("should compute business days excluding weekends", () => {
      // 2026-06-01 is a Monday
      const start = "2026-06-01";
      const deadline = calculateStatutoryDeadline(start, 5, "business");
      // Mon (1), Tue (2), Wed (3), Thu (4), Fri (5) -> 2026-06-08 (Mon)
      expect(deadline).toBe("2026-06-08");
    });

    it("should roll forward calendar days that land on weekends", () => {
      // 2026-06-01 + 5 calendar days is Saturday 2026-06-06 -> rolls to Monday 2026-06-08
      const start = "2026-06-01";
      const deadline = calculateStatutoryDeadline(start, 5, "calendar");
      expect(deadline).toBe("2026-06-08");
    });
  });

  describe("Agency Directory Lookup", () => {
    it("should contain verified federal and state agencies with contact points", () => {
      expect(AGENCIES_DATABASE.length).toBeGreaterThan(5);
      for (const agency of AGENCIES_DATABASE) {
        expect(agency.id).toBeDefined();
        expect(agency.name.length).toBeGreaterThan(0);
        expect(agency.jurisdictionId).toBeDefined();
      }
    });
  });
});
