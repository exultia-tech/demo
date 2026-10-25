import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { NextRequest } from "next/server";
import { proxy } from "@/proxy";
import { OPERATOR_COOKIE_NAME, DEFAULT_OPERATOR_KEY } from "@/app/api/preview/unlock/route";

describe("Proxy Private Preview Lockdown & API Bypass Vectors", () => {
  const originalEnv = { ...process.env };

  beforeEach(() => {
    process.env = { ...originalEnv };
    // Force preview mode active for this test suite
    process.env.PRIVATE_PREVIEW_MODE = "true";
    delete process.env.PUBLIC_LAUNCH;
    delete process.env.ALLOW_PUBLIC_ACCESS;
    // Clear test/vitest flag to test the real production lockdown branch
    delete process.env.NODE_ENV;
    delete (process.env as any).VITEST;
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  function createRequest(
    url: string,
    options?: {
      headers?: Record<string, string>;
      cookies?: Record<string, string>;
    }
  ): NextRequest {
    const req = new NextRequest(new URL(url, "https://exultia.tech"), {
      headers: options?.headers
    });
    if (options?.cookies) {
      for (const [k, v] of Object.entries(options.cookies)) {
        req.cookies.set(k, v);
      }
    }
    return req;
  }

  describe("Root Path API Lockdown (Unauthenticated)", () => {
    it("strictly blocks unauthenticated GET /api/validator with 403", async () => {
      const req = createRequest("https://exultia.tech/api/validator");
      const res = proxy(req);

      expect(res.status).toBe(403);
      const data = await res.json();
      expect(data.error).toContain("Access restricted: site in private preview lockdown");
      expect(data.hint).toContain("X-Operator-Key");
    });

    it("strictly blocks unauthenticated /api/patches/feed with 403", async () => {
      const req = createRequest("https://exultia.tech/api/patches/feed");
      const res = proxy(req);

      expect(res.status).toBe(403);
      const data = await res.json();
      expect(data.error).toBeTruthy();
    });

    it("redirects unauthenticated page visits to /preview", () => {
      const req = createRequest("https://exultia.tech/dashboard");
      const res = proxy(req);

      expect(res.status).toBe(307); // NextResponse.redirect
      expect(res.headers.get("location")).toContain("/preview");
    });
  });

  describe("Operator Bypass Vectors", () => {
    it("bypasses lockdown via X-Operator-Key header", () => {
      const req = createRequest("https://exultia.tech/api/validator", {
        headers: { "x-operator-key": DEFAULT_OPERATOR_KEY }
      });
      const res = proxy(req);

      // Successfully allowed through (NextResponse.next() returns 200)
      expect(res.status).toBe(200);
      expect(res.headers.get("x-middleware-next")).toBe("1");
    });

    it("bypasses lockdown via Authorization: Bearer header", () => {
      const req = createRequest("https://exultia.tech/api/validator", {
        headers: { authorization: `Bearer ${DEFAULT_OPERATOR_KEY}` }
      });
      const res = proxy(req);

      expect(res.status).toBe(200);
      expect(res.headers.get("x-middleware-next")).toBe("1");
    });

    it("bypasses lockdown via ?key= query parameter", () => {
      const req = createRequest(`https://exultia.tech/api/validator?key=${DEFAULT_OPERATOR_KEY}`);
      const res = proxy(req);

      expect(res.status).toBe(200);
      expect(res.headers.get("x-middleware-next")).toBe("1");
    });

    it("bypasses lockdown via exultia_operator_key cookie", () => {
      const req = createRequest("https://exultia.tech/api/validator", {
        cookies: { [OPERATOR_COOKIE_NAME]: DEFAULT_OPERATOR_KEY }
      });
      const res = proxy(req);

      expect(res.status).toBe(200);
      expect(res.headers.get("x-middleware-next")).toBe("1");
    });

    it("rejects invalid keys with 403 on API routes", async () => {
      const req = createRequest("https://exultia.tech/api/validator", {
        headers: { "x-operator-key": "invalid-wrong-key" }
      });
      const res = proxy(req);

      expect(res.status).toBe(403);
      const data = await res.json();
      expect(data.error).toContain("Access restricted");
    });
  });
});
