import { describe, it, expect, beforeEach, afterEach } from "vitest";
import {
  isValidationModeActive,
  getAuthorizedEmails,
  isAuthorizedOperator,
  DEFAULT_AUTHORIZED_EMAILS,
  RESTRICTED_ACCESS_MESSAGE,
} from "@/lib/auth/access-control";

describe("Pre-Launch Validation Mode & Operator Access Control", () => {
  const originalEnv = { ...process.env };

  beforeEach(() => {
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  describe("Validation Mode Activation", () => {
    it("should be active by default during pre-launch", () => {
      delete process.env.PRIVATE_VALIDATION_MODE;
      delete process.env.PUBLIC_LAUNCH;
      expect(isValidationModeActive()).toBe(true);
    });

    it("should remain active when PRIVATE_VALIDATION_MODE is 'true'", () => {
      process.env.PRIVATE_VALIDATION_MODE = "true";
      expect(isValidationModeActive()).toBe(true);
    });

    it("should deactivate when PRIVATE_VALIDATION_MODE is explicitly 'false'", () => {
      process.env.PRIVATE_VALIDATION_MODE = "false";
      expect(isValidationModeActive()).toBe(false);
    });

    it("should deactivate when PUBLIC_LAUNCH is 'true'", () => {
      process.env.PUBLIC_LAUNCH = "true";
      expect(isValidationModeActive()).toBe(false);
    });
  });

  describe("Operator Whitelist Resolution", () => {
    it("should include default root administrators", () => {
      const authorized = getAuthorizedEmails();
      expect(authorized).toContain("admin@exultia.tech");
      expect(authorized).toContain("wstrika2@gmail.com");
      expect(authorized).toContain("wstrika@users.noreply.github.com");
    });

    it("should dynamically include custom AUTHORIZED_EMAILS from environment", () => {
      process.env.AUTHORIZED_EMAILS = "founder@personal.io, tester@qa-team.net ";
      const authorized = getAuthorizedEmails();
      expect(authorized).toContain("founder@personal.io");
      expect(authorized).toContain("tester@qa-team.net");
    });
  });

  describe("Authorization Decisions", () => {
    it("should authorize the root admin email", () => {
      expect(isAuthorizedOperator("admin@exultia.tech")).toBe(true);
      expect(isAuthorizedOperator("ADMIN@EXULTIA.TECH")).toBe(true);
    });

    it("should authorize the founder personal email", () => {
      expect(isAuthorizedOperator("wstrika2@gmail.com")).toBe(true);
      expect(isAuthorizedOperator("WSTRIKA2@GMAIL.COM ")).toBe(true);
    });

    it("should authorize any user account with role 'admin' regardless of email", () => {
      expect(isAuthorizedOperator("custom.auditor@company.com", "admin")).toBe(true);
    });

    it("should strictly deny unauthorized public users", () => {
      expect(isAuthorizedOperator("hacker@malicious.org")).toBe(false);
      expect(isAuthorizedOperator("public.user@gmail.com")).toBe(false);
      expect(isAuthorizedOperator("random@yahoo.com")).toBe(false);
      expect(isAuthorizedOperator("")).toBe(false);
      expect(isAuthorizedOperator(null)).toBe(false);
      expect(isAuthorizedOperator(undefined)).toBe(false);
    });

    it("should provide an explicit restricted access message", () => {
      expect(RESTRICTED_ACCESS_MESSAGE).toContain("Private Pre-Launch Validation");
      expect(RESTRICTED_ACCESS_MESSAGE).toContain("restricted exclusively to authorized operators");
    });
  });
});
