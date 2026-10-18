import { describe, it, expect } from "vitest";
import { CERTIFICATIONS } from "@/lib/axiom-data";
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

  describe("Enterprise Assessment REST API (/api/axiom/exam)", () => {
    it("should initiate an exam session and progressively return questions without exposing answers", async () => {
      const { POST } = await import("@/app/api/axiom/exam/route");
      const startReq = new Request("http://localhost:3000/api/axiom/exam", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "start",
          count: 5,
          cert: "comptia-secplus",
          instantValidation: true,
        }),
      });

      const startRes = await POST(startReq);
      expect(startRes.status).toBe(200);
      const startData = await startRes.json();
      expect(startData.token).toBeDefined();
      expect(startData.total).toBe(5);
      expect(startData.index).toBe(0);
      expect(startData.question).toBeDefined();
      expect(startData.question.question).toBeDefined();
      // Server MUST NOT leak correct answers or explanations up front
      expect(startData.question.correctAnswer).toBeUndefined();
      expect(startData.question.explanation).toBeUndefined();

      // Submit an answer
      const answerReq = new Request("http://localhost:3000/api/axiom/exam", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "answer",
          token: startData.token,
          answer: 0,
        }),
      });

      const answerRes = await POST(answerReq);
      expect(answerRes.status).toBe(200);
      const answerData = await answerRes.json();
      expect(answerData.token).toBeDefined();
      expect(answerData.feedback).toBeDefined();
      expect(typeof answerData.feedback.correct).toBe("boolean");
      expect(answerData.feedback.explanation.length).toBeGreaterThan(0);
    });

    it("should reject invalid or tampered session tokens with 401", async () => {
      const { POST } = await import("@/app/api/axiom/exam/route");
      const req = new Request("http://localhost:3000/api/axiom/exam", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "answer",
          token: "invalid.tampered.token",
          answer: 1,
        }),
      });

      const res = await POST(req);
      expect(res.status).toBe(401);
    });
  });
});
