import { describe, it, expect, vi, beforeEach } from "vitest";
import { 
  generateAxiomStudentHistory, 
  formatAxiomCsv, 
  formatAxiomCertificateHtml 
} from "@/lib/axiom-data";

// Mutable mock state for resolveAxiomAuthAndTier
let mockAuthResult: {
  user: { id: string; email: string; name?: string | null; role: string };
  tier: "free" | "pro" | "enterprise";
} | null = null;

vi.mock("@/lib/axiom-server-auth", () => ({
  resolveAxiomAuthAndTier: vi.fn(async () => mockAuthResult),
}));

describe("Axiom Pro Tier & LMS Feed Gating Tests", () => {
  beforeEach(() => {
    mockAuthResult = null;
  });

  describe("Student Transcript & Certificate Generator", () => {
    it("should generate deterministic student history with courses, scores, and verifiable certs", () => {
      const history = generateAxiomStudentHistory(
        "usr_student_test_1",
        "student@exultia.tech",
        "Jane Doe",
        "pro"
      );

      expect(history.candidate.userId).toBe("usr_student_test_1");
      expect(history.candidate.id).toBe("AX-TEST_1");
      expect(history.candidate.name).toBe("Jane Doe");
      expect(history.candidate.tier).toBe("pro");
      expect(history.courseHistory.length).toBeGreaterThan(0);
      expect(history.examScores.length).toBeGreaterThan(0);
      expect(history.certificates.length).toBeGreaterThan(0);

      const cert = history.certificates[0];
      expect(cert.certificateId).toMatch(/^AXIOM-CERT-/);
      expect(cert.verificationHash).toContain("sha256:");
      expect(cert.verificationUrl).toContain(cert.certificateId);
    });

    it("should format valid RFC 4180 CSV with course history, scores, and certs", () => {
      const history = generateAxiomStudentHistory(
        "usr_student_test_2",
        "student2@exultia.tech",
        "Alex Rivers",
        "pro"
      );
      const csv = formatAxiomCsv(history);

      expect(csv).toContain("SECTION: COURSE_PROGRESS_HISTORY");
      expect(csv).toContain("SECTION: EXAM_ATTEMPTS_AND_SCORES");
      expect(csv).toContain("SECTION: VERIFIED_EXAM_CERTIFICATES");
      expect(csv).toContain("student2@exultia.tech");
      expect(csv).toContain("Alex Rivers");
      expect(csv).toContain(history.certificates[0].certificateId);
    });

    it("should generate high-resolution print-ready HTML certificate with digital seal", () => {
      const history = generateAxiomStudentHistory(
        "usr_student_test_3",
        "student3@exultia.tech",
        "Sam Taylor",
        "pro"
      );
      const html = formatAxiomCertificateHtml(history.certificates[0]);

      expect(html).toContain("<!DOCTYPE html>");
      expect(html).toContain("Certificate of Competency");
      expect(html).toContain(history.certificates[0].certificateId);
      expect(html).toContain(history.certificates[0].candidateName);
      expect(html).toContain("Sam Taylor");
    });
  });

  describe("Export API (/api/axiom/export) Authorization & Gating", () => {
    it("should reject unauthenticated export requests with 401 UNAUTHORIZED", async () => {
      mockAuthResult = null;
      const { GET } = await import("@/app/api/axiom/export/route");
      const req = new Request("http://localhost:3000/api/axiom/export");
      const res = await GET(req);

      expect(res.status).toBe(401);
      const data = await res.json();
      expect(data.code).toBe("UNAUTHORIZED");
    });

    it("should reject Free tier users from exporting student transcripts with 403 UPGRADE_REQUIRED", async () => {
      mockAuthResult = {
        user: { id: "usr_free_user", email: "free@example.com", name: "Free User", role: "user" },
        tier: "free",
      };

      const { GET } = await import("@/app/api/axiom/export/route");
      const req = new Request("http://localhost:3000/api/axiom/export?format=json");
      const res = await GET(req);

      expect(res.status).toBe(403);
      const data = await res.json();
      expect(data.code).toBe("UPGRADE_REQUIRED");
      expect(data.message).toContain("Axiom Pro subscription ($49/mo)");
    });

    it("should allow Pro tier users to export course history, scores, and certificates as JSON", async () => {
      mockAuthResult = {
        user: { id: "usr_pro_user", email: "pro@example.com", name: "Pro Student", role: "user" },
        tier: "pro",
      };

      const { GET } = await import("@/app/api/axiom/export/route");
      const req = new Request("http://localhost:3000/api/axiom/export?format=json");
      const res = await GET(req);

      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.success).toBe(true);
      expect(data.candidate.tier).toBe("pro");
      expect(data.courseHistory.length).toBeGreaterThan(0);
      expect(data.examScores.length).toBeGreaterThan(0);
      expect(data.certificates.length).toBeGreaterThan(0);
    });

    it("should allow Pro tier users to export conventional CSV files", async () => {
      mockAuthResult = {
        user: { id: "usr_pro_user_csv", email: "procsv@example.com", name: "Pro CSV Student", role: "user" },
        tier: "pro",
      };

      const { GET } = await import("@/app/api/axiom/export/route");
      const req = new Request("http://localhost:3000/api/axiom/export?format=csv");
      const res = await GET(req);

      expect(res.status).toBe(200);
      expect(res.headers.get("content-type")).toContain("text/csv");
      const csvText = await res.text();
      expect(csvText).toContain("SECTION: COURSE_PROGRESS_HISTORY");
      expect(csvText).toContain("SECTION: EXAM_ATTEMPTS_AND_SCORES");
      expect(csvText).toContain("SECTION: VERIFIED_EXAM_CERTIFICATES");
    });

    it("should allow Pro tier users to export printable HTML certificates", async () => {
      mockAuthResult = {
        user: { id: "usr_pro_user_cert", email: "procert@example.com", name: "Pro Cert Student", role: "user" },
        tier: "pro",
      };

      const { GET } = await import("@/app/api/axiom/export/route");
      const req = new Request("http://localhost:3000/api/axiom/export?format=certificate");
      const res = await GET(req);

      expect(res.status).toBe(200);
      expect(res.headers.get("content-type")).toContain("text/html");
      const htmlText = await res.text();
      expect(htmlText).toContain("Certificate of Competency");
      expect(htmlText).toContain("Pro Cert Student");
    });
  });

  describe("LMS Exam Simulator Embedding Feed Gating (Enterprise Only)", () => {
    it("should reject Pro tier users from accessing LMS simulator embed feed on /api/axiom/export with 403", async () => {
      mockAuthResult = {
        user: { id: "usr_pro_user_lms", email: "prolms@example.com", name: "Pro User", role: "user" },
        tier: "pro",
      };

      const { GET } = await import("@/app/api/axiom/export/route");
      const req = new Request("http://localhost:3000/api/axiom/export?type=lms_embed");
      const res = await GET(req);

      expect(res.status).toBe(403);
      const data = await res.json();
      expect(data.code).toBe("ENTERPRISE_TIER_REQUIRED");
      expect(data.message).toContain("LMS system (Canvas, Blackboard, Moodle, SCORM, LTI) is restricted to Enterprise");
    });

    it("should reject Pro tier users from accessing LMS embed feed on POST /api/axiom/exam with 403", async () => {
      mockAuthResult = {
        user: { id: "usr_pro_user_exam_lms", email: "proexam@example.com", name: "Pro User", role: "user" },
        tier: "pro",
      };

      const { POST } = await import("@/app/api/axiom/exam/route");
      const req = new Request("http://localhost:3000/api/axiom/exam", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "lms_embed", cert: "comptia-secplus" }),
      });
      const res = await POST(req);

      expect(res.status).toBe(403);
      const data = await res.json();
      expect(data.code).toBe("ENTERPRISE_TIER_REQUIRED");
    });

    it("should reject Pro tier users from accessing LMS embed feed on GET /api/axiom/exam?feed=lms with 403", async () => {
      mockAuthResult = {
        user: { id: "usr_pro_user_get_lms", email: "proget@example.com", name: "Pro User", role: "user" },
        tier: "pro",
      };

      const { GET } = await import("@/app/api/axiom/exam/route");
      const req = new Request("http://localhost:3000/api/axiom/exam?feed=lms");
      const res = await GET(req);

      expect(res.status).toBe(403);
      const data = await res.json();
      expect(data.code).toBe("ENTERPRISE_TIER_REQUIRED");
    });

    it("should grant Enterprise tier users access to the live LMS simulator embedding feed", async () => {
      mockAuthResult = {
        user: { id: "usr_ent_user", email: "enterprise@university.edu", name: "University Admin", role: "user" },
        tier: "enterprise",
      };

      const { POST } = await import("@/app/api/axiom/exam/route");
      const req = new Request("http://localhost:3000/api/axiom/exam", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "lms_embed", cert: "comptia-secplus" }),
      });
      const res = await POST(req);

      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.success).toBe(true);
      expect(data.tier).toBe("enterprise");
      expect(data.protocol).toBe("LTI_v1_3_SCORM_2004");
      expect(data.embedUrl).toContain("/app/axiom?embed=true");
      expect(data.features).toContain("canvas_blackboard_moodle_compatibility");
    });

    it("should grant Enterprise tier users access to GET /api/axiom/export?type=lms_embed", async () => {
      mockAuthResult = {
        user: { id: "usr_ent_user", email: "enterprise@university.edu", name: "University Admin", role: "user" },
        tier: "enterprise",
      };

      const { GET } = await import("@/app/api/axiom/export/route");
      const req = new Request("http://localhost:3000/api/axiom/export?type=lms_embed");
      const res = await GET(req);

      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.success).toBe(true);
      expect(data.meta.license).toBe("ENTERPRISE_INSTITUTIONAL_LMS_FEED");
      expect(data.meta.tier).toBe("enterprise");
      expect(Array.isArray(data.data)).toBe(true);
      expect(data.data.length).toBeGreaterThan(0);
    });
  });
});
