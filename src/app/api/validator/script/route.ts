import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

import { EMBEDDED_VALIDATOR_SCRIPT } from "@/lib/embedded-validator";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  // Try locating validate.py across candidate locations
  const candidatePaths = [
    path.join(process.cwd(), "..", "demo", "validate.py"),
    path.join(process.cwd(), "public", "downloads", "validate.py"),
    path.join(process.cwd(), "scripts", "validate.py"),
    path.join(process.cwd(), "validate.py")
  ];

  let scriptContent = "";
  for (const p of candidatePaths) {
    if (fs.existsSync(p)) {
      try {
        scriptContent = fs.readFileSync(p, "utf-8");
        break;
      } catch {
        // continue
      }
    }
  }

  if (!scriptContent) {
    scriptContent = EMBEDDED_VALIDATOR_SCRIPT;
  }

  if (!scriptContent) {
    return new NextResponse("#!/usr/bin/env python3\nprint('Exultia Validator script unavailable')\n", {
      status: 404,
      headers: { "Content-Type": "text/plain; charset=utf-8" }
    });
  }

  return new NextResponse(scriptContent, {
    headers: {
      "Content-Type": "text/x-python; charset=utf-8",
      "Content-Disposition": 'inline; filename="validate.py"',
      "Cache-Control": "no-cache"
    }
  });
}
