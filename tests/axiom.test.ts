import { describe, it, expect } from "vitest";
import { CERTIFICATIONS, LABS_DB } from "@/lib/axiom-data";
import { MOCK_EXAM_DB } from "@/lib/axiom-exam-data";

describe("Axiom Module Tests", () => {
  describe("Certifications & Syllabus DB", () => {
    it("should include key certifications with valid domain weights or N/A", () => {
      const certIds = Object.keys(CERTIFICATIONS);
      expect(certIds).toContain("isc2-cc");
      expect(certIds).toContain("comptia-secplus");
      expect(certIds).toContain("comptia-cysa");
      expect(certIds).toContain("offensive-oscp");

      for (const cert of Object.values(CERTIFICATIONS)) {
        expect(cert.id).toBeDefined();
        expect(cert.title.length).toBeGreaterThan(0);
        expect(cert.vendor.length).toBeGreaterThan(0);
        expect(cert.domains.length).toBeGreaterThan(0);
        for (const domain of cert.domains) {
          expect(domain.id).toBeDefined();
          expect(typeof domain.weight).toBe("string");
          expect(domain.weight.length).toBeGreaterThan(0);
          expect(domain.topics.length).toBeGreaterThan(0);
        }
      }
    });

    it("should provide valid resources for each certification", () => {
      for (const cert of Object.values(CERTIFICATIONS)) {
        expect(cert.resources.length).toBeGreaterThan(0);
        for (const res of cert.resources) {
          expect(res.name).toBeDefined();
          expect(res.type).toBeDefined();
          expect(res.url).toBeDefined();
        }
      }
    });
  });

  describe("Interactive Security Terminal Labs", () => {
    it("should have all required lab simulations with instructions", () => {
      expect(LABS_DB.length).toBeGreaterThanOrEqual(6);
      const expectedIds = ["lab-nmap-1", "lab-privesc-1", "lab-web-1", "lab-crypto-1", "lab-logs-1", "lab-casp-arch-1"];
      const ids = LABS_DB.map((l) => l.id);
      for (const expected of expectedIds) {
        expect(ids).toContain(expected);
      }

      for (const lab of LABS_DB) {
        expect(lab.title).toBeDefined();
        expect(lab.type).toBeDefined();
        expect(lab.difficulty).toBeDefined();
        expect(lab.objective).toBeDefined();
        expect(lab.instructions.length).toBeGreaterThan(0);
      }
    });
  });

  describe("Exam Question Bank & Server-Side Security Isolation", () => {
    it("should load the question bank with valid structure and options", () => {
      expect(MOCK_EXAM_DB.length).toBeGreaterThan(20);
      for (const q of MOCK_EXAM_DB.slice(0, 100)) {
        expect(q.id).toBeDefined();
        expect(q.cert).toBeDefined();
        expect(q.question.length).toBeGreaterThan(10);
        expect(q.options.length).toBeGreaterThanOrEqual(2);
        expect(q.correctAnswer).toBeGreaterThanOrEqual(0);
        expect(q.correctAnswer).toBeLessThan(q.options.length);
        expect(q.explanation.length).toBeGreaterThan(5);
      }
    });

    it("should contain diverse certification representation", () => {
      const certs = new Set(MOCK_EXAM_DB.map((q) => q.cert));
      expect(certs.has("comptia-secplus")).toBe(true);
      expect(certs.has("isc2-cc")).toBe(true);
      expect(certs.has("isc2-cissp")).toBe(true);
      expect(certs.has("offensive-oscp")).toBe(true);
    });
  });
});
